import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { settingsSchema } from '@/lib/validators'
import { isDynamicServerError } from '@/lib/utils'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId: session.user.id },
    })

    if (!settings) {
      // Create default settings if they don't exist
      settings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          emailOnSuccess: true,
          emailOnFailure: true,
          browserNotifications: false,
          theme: 'LIGHT',
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// Accept both PUT and PATCH
async function handleUpdate(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Map emailNotifications (from NotificationsPanel) -> emailOnSuccess
  const normalized: Record<string, unknown> = { ...body }
  if ('emailNotifications' in normalized) {
    normalized.emailOnSuccess = normalized.emailNotifications
    normalized.emailOnFailure = normalized.emailNotifications
    delete normalized.emailNotifications
  }

  const parsed = settingsSchema.safeParse(normalized)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    )
  }

  const settings = await prisma.userSettings.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: {
      userId: session.user.id,
      emailOnSuccess: parsed.data.emailOnSuccess ?? true,
      emailOnFailure: parsed.data.emailOnFailure ?? true,
      browserNotifications: parsed.data.browserNotifications ?? false,
      theme: parsed.data.theme ?? 'LIGHT',
    },
  })

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  try {
    return await handleUpdate(request)
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Settings PUT error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    return await handleUpdate(request)
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Settings PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (isDynamicServerError(error)) throw error
    console.error('Settings DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}

